# "Collections"

EatUnit -->
"users" -id-> User -> "years" -num-> "weeks" -num-> Week -> "days" -date-> Day (JSON) .Intake."MEAL" as ItemInstance[]

Ingredients -->
"Items" -id-> Item (JSON)

# Routes

/2022/week/41 --> collection(db, "users/1/years/2022/weeks/41/days");

/2022/week/41/day/2022-10-15 --> doc(db, "users/1/years/2022/weeks/41/days/2022-10-15");

/items --> collection(db, "Items")
