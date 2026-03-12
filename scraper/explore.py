from playwright.sync_api import sync_playwright
import time

def explore_lawnet():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating to LawNet...")
        
        try:
            page.goto("https://www.lawnet.gov.lk/legislative-enactments/", timeout=60000)
            page.wait_for_load_state("networkidle")
            
            # Print the title to ensure we're on the right page
            print(f"Page Title: {page.title()}")
            
            # Let's see if we can find any links that might be acts
            # Often they are in a table or a specific div. Let's get the inner text of the body to see what rendered.
            body_text = page.locator("body").inner_text()
            print("\n--- BODY PREVIEW (First 1000 chars) ---")
            print(body_text[:1000])
            
            # Let's dump all links to see their structure
            print("\n--- LINK ANALYSIS ---")
            links = page.locator("a").element_handles()
            acts_found = 0
            for link in links[:50]: # Just first 50 to see patterns
                text = link.inner_text().strip()
                href = link.get_attribute("href")
                if text and href and len(text) > 5:
                    print(f"LINK: {text} -> {href}")
                    acts_found += 1
            print(f"Total non-empty links found in first 50: {acts_found}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    explore_lawnet()
