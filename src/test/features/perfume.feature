Feature: Perfume Filter Test

  Scenario Outline: Perfume filter test
    Given User navigate to the homepage
    When User navigate to perfume products
    When User apply the perfume filter for creatria "<criteria>"
    When User apply the perfume filter for brand "<marke>"
    And User validate the brand details for "<marke>"
    And User filter by classification "<produktart>"
    And User validate the classification details for "<produktart>"
    And User apply filters for occasion "<geschenkFur>"
    When User apply the perfume filter for gender "<furWen>"
    Then User verify the product display for "<product>"

    Examples:
      | criteria       | marke             | produktart         | geschenkFur   | furWen         | product                                       |
      | "Sale"         | "cacharel"        | "Eau de Parfum"    | "Weihnachten" | "Weiblich"     | "CacharelYes I AmEau de Parfum"               |
      | "NEU"          | "Acqua di Parma"  | "After Shave"      | "Dankeschön"  | "Unisex"       | "Balsamo Dopobarba alla Colonia After Shave"  |
      | "Sale"         | "Guess"           | "Eau de Toilette"  | "Geburtstag " | "Unisex"       | "Kiss for Women Eau de Toilette"              |