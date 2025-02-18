Here is the Python Selenium automation script for the given test cases:

```python
import unittest
from selenium import webdriver

class ReviewsTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Create browser instance
        cls.driver = webdriver.Chrome()
        cls.driver.implicitly_wait(10)
        cls.driver.maximize_window()

        # Log in code here

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_add_review(self):
        self.driver.get("http://www.test2.com/reviews")
        # Write review by entering data into form 
        title_input = self.driver.find_element_by_id("review-title") 
        title_input.send_keys("Excellent Product")  

        desc_textarea = self.driver.find_element_by_id("review-description")
        desc_textarea.send_keys("It is an amazing product and I would recommend it to everyone.") 
        
        rating_radio = self.driver.find_element_by_id("review-rating-5")
        rating_radio.click()  

        submit_button = self.driver.find_element_by_css_selector("#review-form button[type='submit']")
        submit_button.click()

        # Assert review appears on page
        review = self.driver.find_element_by_xpath("//div[@class='review' and contains(., 'Excellent Product')]")
        self.assertTrue(review.is_displayed())

    def test_edit_review(self):
        # Edit previously posted review
        edit_button = self.driver.find_element_by_xpath("//div[@class='review']/button[text()='Edit']")
        edit_button.click()

        new_rating = self.driver.find_element_by_id("review-rating-4") 
        new_rating.click()

        update_button = self.driver.find_element_by_css_selector("#review-form button[type='submit']")
        update_button.click()  

        # Assert edited review is displayed
        review = self.driver.find_element_by_xpath("//div[@class='review' and contains(., 'Excellent Product') and .//span[@class='rating' and text()='4']]")
        self.assertTrue(review.is_displayed())

        
    def test_delete_review(self):
        # Delete test review 
        delete_button = self.driver.find_element_by_css_selector(".review button.delete")
        delete_button.click()

        # Confirm deletion
        delete_confirm_button = self.driver.find_element_by_css_selector("#deleteConfirmButton") 
        delete_confirm_button.click()

        # Assert review is deleted
        reviews = self.driver.find_elements_by_css_selector(".review") 
        self.assertNotIn("Excellent Product", [r.text for r in reviews])
        

    def test_sort_reviews(self):
        self.driver.get("http://www.test2.com/reviews")
        
        # Sort reviews by highest rating
        sort_dropdown = self.driver.find_element_by_id("sort-by")
        sort_dropdown.click()
        high_to_low_option = self.driver.find_element_by_css_selector("#sorts li[data-sort='ratingDesc']")
        high_to_low_option.click()

        # Verify reviews sorted by highest rating first
        ratings = self.driver.find_elements_by_css_selector(".review .rating .score")  
        rating_nums = [int(r.text) for r in ratings]
        self.assertEqual(sorted(rating_nums, reverse=True), rating_nums)
        

    def test_filter_by_rating(self):
        self.driver.get("http://www.test2.com/reviews")

        # Apply 5 star filter
        five_star_filter = self.driver.find_element_by_css_selector(".filters #5stars") 
        five_star_filter.click()  

        # Verify only 5 star reviews are visible
        ratings = self.driver.find_elements_by_css_selector(".review .rating .score")
        for rating in ratings:
            self.assertEqual(int(rating.text), 5)

if __name__ == '__main__':
    unittest.main(verbosity=2)
```

I have implemented the major test cases along with setup, teardown, assertions and proper indentation/structuring. Please review and let me know if any changes are needed or if you would like me to implement any additional test cases.