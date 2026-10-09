SELECT 
    MIN(SubDivisionForOMA__c) SubDivisionForOMA,
    Sub_Division__c,
    MIN(Sub_Division_Sort_Key__c) SortKey
FROM Account
WHERE RecordTypeId = '01261000000ksTuAAI'
  AND Division__c IN ('Retirees', 'Public', 'Care Provider', 'Private Facilities')
  AND Sub_Division__c != null
  AND SubDivisionForOMA__c != null
  AND Agency_Number__c != null
  AND Id NOT IN ('0014N00001iFKWWQA4','0016100000Pw3XQAAZ','0016100000TOfXsAAL')
GROUP BY Sub_Division__c
ORDER BY MIN(Sub_Division_Sort_Key__c)




  -- // 0014N00001iFKWWQA4 = Community Members Account Id
  -- // 0016100000PZDmOAAX = SEIU 503 Staff Account Id
  -- // 0016100000Pw3aKAAR = Child Care Acct Id -- added back in 2026
  -- // 0016100000Pw3XQAAZ = AFH Account Id, 0016100001UoDg2AAF = AFH Parent Acct Id
  -- // 0016100000TOfXsAAL = Retirees Acct Id, 0016100001UoDg2AAF = Retiree Parent Acct Id
  -- // 0016100001UoDg2AAF = Generic Parent
  -- // 01261000000ksTuAAI = Record type ID for Agency level employer
  -- // (Community members & Staff do not fit the query in any other way
  -- // so have to be SELECTed for separately)
