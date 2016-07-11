# Flavorize
##### Recipe creator app as my front-end, 3 month capstone project for Nashville Software School.
* View recipes from all users
* Login/Register your own user account
* Create, edit, and delete recipes
* Get flavor pairings based on ingredients
* Get nutritional information for recipes
* Upload an image of your recipe
* Mobile responsive app

### Installation
1. Download files from Github and move into project folder in terminal
2. To download and install dependencies, run command:
    ```
    $ npm install
    ```

3. To host locally, run command:
    ```
    $ npm run serve
    ```
4. Go to http://localhost:8080/#/ in web browser for home page

### How To Use
From the home page, users can see recipes saved by all users. If a recipe is clicked on, it will go to the view recipe page which will display the recipe in full. If a user wishes to create their own recipes, they can log into their account or register a new user from the login page. Once logged in, users can create, edit, and delete recipes from the My Recipes tab in the navigation bar. When creating or editing a recipe, any ingredients added in any of the tabs (Recipe, Food Pairing, and Nutrition) are automatically searched for in both the Foodpairing and USDA databases for relevant matches in those databases. If a user wants to save a recipe, they need to click the Save Recipe button before leaving the page, otherwise recipe will not be saved/updated.

* ##### Recipe Tab
    * Users can add ingredients, the amount of ingredient per recipe, and any additional information (minced, chopped, etc.)
    * Add the title and author
    * Add a photo of the dish
    * Add directions

* ##### Food Pairing Tab
    * Users can select the closest flavor profile for each ingredient from a select input populated by the Foodpairings API search results
    * Pairings will be displayed based on all ingredients that have a flavor profile selected
    * Users can add ingredients from pairings by clicking the add ingredient button
    * If a pairing suggestion has descriptive information in parentheses, that information will be automatically added to the additional information input in the Recipe tab

* ##### Nutrition Tab
    * Users can select the closest nutrition profile for each ingredient from a select input
    * Once selected, it will search the USDA database for nutritional data and display the USDA units for that ingredient
    * User can then type in the amount of ingredient in the recipe based on the USDA units provided
    * The calories, sugars, fats, carbohydrates per recipe will then be displayed/updated dynamically
    * Users can input the number of servings per recipe, which will also dynamically show the nutrition data per serving

### APIs Used
* [Foodpairing](http://developer.foodpairing.com/)
* [National Nutrient Database for Standard Reference Release 28](https://ndb.nal.usda.gov/ndb/api/doc#)
