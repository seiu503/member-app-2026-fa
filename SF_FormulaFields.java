// SubDivisionForOMA__c
IF( CONTAINS(TEXT(Sub_Division__c) , "Higher Ed") ,"Higher Education",
IF( CONTAINS(TEXT(Sub_Division__c) , "Local Gov") ,"Local Government (City, County, School District)",
IF( CONTAINS(TEXT(Sub_Division__c) , "Nursing Homes") ,"Nursing Home",
IF( CONTAINS(TEXT(Sub_Division__c) , "PNP") ,"Non-Profit",
IF( CONTAINS(TEXT(Sub_Division__c) , "State") ,"State Agency",
IF( CONTAINS(TEXT(Sub_Division__c) , "State Homecare") ,"State Homecare or Personal Support",
IF( CONTAINS(TEXT(Sub_Division__c) , "Private Homecare") ,"Private Homecare Agency",
IF( CONTAINS(TEXT(Sub_Division__c) , "Retirees") ,"Retiree", "")
)))))))

// AccountNameForOMA__c
IF( CONTAINS(Name, "PPL PSW") ,"Personal Support Worker (paid by PPL)",
IF( CONTAINS(Name, "State APD") ,"Homecare Worker (Aging and People with Disabilities)",
IF( CONTAINS(Name, "State PSW") ,"Personal Support Worker (paid by State of Oregon)", "")
))