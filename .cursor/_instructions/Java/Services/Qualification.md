# Definition
Innovation Studio is a production from BMC Helix.  
A qualification is used in BPMN process activities to define conditions, for example in an Exclusive Gateway to route the process flow based on the end user intent.  
It is also used in Innovation Studio / AR System Java code to filter data when querying Records or other data sources.  
The qualification is a series of expressions combined using logical operators, and is used to filter data or route the process flow.  


## Building a qualification  
The Innovation Studio qualification is a series of expressions that filter data based on field values.

### Expression structure
An expression has a standard format:
* The **left-hand side** is a variable (process variable, process activity result, or record definition field id),
* The **right-hand side** is usually a string (between double quotes like "foo"), a number, or another field reference,

### Supported operators
The qualification supports the following operators:

**Comparison operators:**
* `=` (equals)
* `>` (greater than)
* `>=` (greater than or equal to)
* `<` (less than)
* `<=` (less than or equal to)
* `!=` (different than)
* `LIKE` (used to search for a pattern, using `%` as fuzzy operator),
 * For example, here we would look at content of field 8 that would start with "foo":
 * `'8' LIKE "foo%"`

**Mathematical operators:**
* `+` (addition)
* `-` (subtraction)
* `*` (multiplication)
* `/` (division)

**Logical operators:**
* `AND` (logical and)
* `OR` (logical or)
* `NOT` (logical not)

**Constants:**
* `NULL` (null value)

**Expression separators:**
* `(` and `)` (Parentheses `(` and `)` are used to group expressions and control logical precedence), for example:
  * `('7' = "New York" AND '8' = "Temperature type") OR ('7' = "Santa Clara")`


### Examples
```
'7' = "New York"
'7' = "New York" AND '8' = "Temperature type"
'7' > 100
'7' = NULL
'8' LIKE "foo%"
('7' = "New York" AND '8' = "Temperature type") OR ('7' = "Santa Clara")
```

### Building qualification expressions

To build qualifications, you have access to:
* A list of fields from a record definition (or an AR System form), each field has a fieldId (an integer) and a type (Numeric, Character, Enum, etc...),
* Constants (as seen above),
* Values (text or numeric),

### Rules for building expressions

**Left-hand side of the expression:**
* Use the record definition (AR System forms) fieldIds as the left-hand side of the expression, enclosed in single quotes
* Example: `'7' = "New York"` where 7 is the fieldId

**Right-hand side of the expression:**
* **Constants:** Use the constant name directly
  * Example: `'7' = NULL`
* **Numeric values:** Use the number directly (no quotes)
  * Example: `'7' = 42` or `'7' = 3.14`
* **Text values:** Use double quotes around the text
  * Example: `'7' = "New York"`
* **Enum/Selection values:** Use the numeric value (integer) that represents the selection option
  * Example: `'7' = 0` (where 0 might represent "New")
  * **Important:** Use the numeric value, not the text, because text values can be localized
* **Field references:** To use the value of another field in the search, use dollar signs around the fieldId
  * Example: `'7' = $8$` means: search field 7 for values matching the content of field 8

### Critical Rules Summary

| Use Case | Syntax | Example |
|----------|--------|---------|
| Search by fieldId | `'<fieldId>' = <value>` | `'7' = "New York"` |
| Use value from another field | `'<fieldId>' = $<otherFieldId>$` | `'7' = $8$` |
| Use constant | `'<fieldId>' = <CONSTANT>` | `'7' = NULL` |
| Use text value | `'<fieldId>' = "<text>"` | `'7' = "New York"` |
| Use numeric value | `'<fieldId>' = <number>` | `'7' = 42` |
| Use enum/selection value | `'<fieldId>' = <integer>` | `'7' = 0` |

### Common Patterns

**Simple equality:**
```
'8' = "foo"
```

**Multiple conditions:**
```
'8' = "foo" AND '7' > 100
```

**Using OR operator:**
```
'7' = "New York" OR '7' = "Boston"
```

**Comparing two fields:**
```
'7' = $8$
```

**Checking for null:**
```
'7' = NULL
```
  
**Checking for text beginning by "foo":**
```
'8' LIKE "foo%"
```


**Checking for text ending by "foo":**
```
'8' LIKE "%foo"
```

**Checking for text containing "foo":**
This should not be used if possible, as database indexes might not be used, resulting in table full scan:  
```
'8' LIKE "%foo%"
```
