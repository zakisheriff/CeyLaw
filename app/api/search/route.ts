import { NextResponse } from 'next/server';
import { retrieveLegalContext } from '@/lib/ai/retrieval';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const { context, citations } = await retrieveLegalContext(query);
    
    // Format citations and context into the SearchResult format expected by the frontend
    // Note: The frontend expects Law object and LawSection object.
    // Since retrieveLegalContext returns act_title, section, and content, we'll map them.
    
    const results = citations.map((cite, index) => {
      // Split context by --- to find the content for this specific citation
      const sections = context.split('---').filter(s => s.trim());
      const relevantSection = sections.find(s => s.includes(`Act: ${cite.act}`) && s.includes(`Section ${cite.section}`));
      
      let excerpt = "Section content not found.";
      if (relevantSection) {
        const contentMatch = relevantSection.match(/Section .*:\n([\s\S]*)/);
        if (contentMatch) {
          excerpt = contentMatch[1].trim();
        }
      }

      return {
        type: "section",
        law: {
          title: cite.act,
          slug: cite.slug,
          year: "n/a", // Year is not explicitly in Citation type but we could extract it if needed
          act_number: "act",
          category: "general law"
        },
        section: {
          section_number: cite.section.replace('Section ', ''),
          heading: `Section ${cite.section}`,
          content: excerpt
        },
        excerpt: excerpt,
        relevance: index === 0 ? "High" : "Medium"
      };
    });

    return NextResponse.json({ results });

  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
