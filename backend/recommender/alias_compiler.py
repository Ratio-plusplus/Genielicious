# script to process yelp data on existing categories

import json
"""
yelp api call output of all existing business categories 
"""
# file_path = "recommender/results/all_business_categories.json"

"""
compilation of all categories that have to do with food.
including only the alias and title
"""
# output_path = "recommender/results/all_food_categories.json" 

"""
important_food_categories.json was compiled by manually deleting categories that weren't important 
    (e.g beverage stores, supermarkets etc.)
"""
file_path = "recommender/results/important_food_categories.json" 
output_path = "recommender/results/important_aliases.json" # file that includes only aliases

with open(file_path, 'r') as file:
    res = json.load(file)

aliases = []    # list of alias strings
food_dicts = [] # list of dictionaries that hold alias and title 
for cat in res["categories"]:
    parents = []
    for parent in cat["parent_aliases"]:
        parents.append(parent)
    # if ("food" in parents or        # makes sure business has to do with food
    #     "restaurants" in parents or
    #     "gourmet" in parents):
    aliases.append(cat["alias"])      # add alias to list
    food_dict = {
        "alias" : cat["alias"],
        "title" : cat["title"]
    }
    food_dicts.append(food_dict)

cats = {
    "categories": food_dicts
}

### used to write alias + title dictionaries to a file
# with open(output_path, 'w') as file:
#     json.dump(cats, file, indent=4)
# print("Dictionary written to file in JSON format.")

### used to write list of aliases to a file
with open(output_path, "w") as file:
    json.dump({"aliases":aliases}, file, indent=4)