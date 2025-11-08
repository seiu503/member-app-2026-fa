-- Generic query
SELECT Name, Id
FROM Account
WHERE RecordTypeId = '01261000000ksTuAAI'
  AND Division__c IN ('Retirees', 'Public', 'Care Provider', 'Private Facilities')
  AND Sub_Division__c = 'Higher Ed'
  AND Sub_Division__c != null
  AND Agency_Number__c != null
  AND Id NOT IN (
    '0014N00001iFKWWQA4',
    '0016100000Pw3XQAAZ',
    '0016100000TOfXsAAL',
    '0016100000Pw3aKAAR',
    '0014N00002ASaRxQAL'
  )
ORDER BY Name

-- Homecare query
SELECT AccountNameForOMA__c, Id
FROM Account
WHERE RecordTypeId = '01261000000ksTuAAI'
  AND Division__c IN ('Retirees', 'Public', 'Care Provider', 'Private Facilities')
  AND Sub_Division__c = 'State Homecare'
  AND Sub_Division__c != null
  AND Agency_Number__c != null
  AND Id NOT IN (
    '0014N00001iFKWWQA4',
    '0016100000Pw3XQAAZ',
    '0016100000TOfXsAAL',
    '0016100000Pw3aKAAR',
    '0014N00002ASaRxQAL'
  )
ORDER BY AccountNameForOMA__c


-- Higher Ed,
-- Local Gov,
-- Nursing Homes,
-- PNP,
-- State,
-- State Homecare, 
-- Private Homecare,
-- Retirees




-- 0014N00001iFKWWQA4 = Community Members Account Id
-- 0016100000PZDmOAAX = SEIU 503 Staff Account Id
-- 0016100000Pw3aKAAR = Child Care Acct Id
-- 0016100000Pw3XQAAZ = AFH Account Id, 0016100001UoDg2AAF = AFH Parent Acct Id
-- 0016100000TOfXsAAL = Retirees Acct Id, 0016100001UoDg2AAF = Retiree Parent Acct Id
-- 0016100001UoDg2AAF = Generic Parent
-- 01261000000ksTuAAI = Record type ID for Agency level employer
-- 0014N00002ASaRxQAL = 'Homecare Holding' account Id




-- PPL PSW 0014N00002ASaRyQAL
-- State APD 0014N00002ASaRzQAL
-- State PSW 0014N00002ASaS0QAL


-- AID_Formula tfa_442
-- AID_HiEd tfa_430
-- AID_LGov tfa_436
-- AID_NH tfa_432
-- AID_PNP tfa_434
-- AID_State tfa_427
-- AID_StateHomecare tfa_401
-- AID_PrivateHomecare tfa_438
-- AID_Retirees tfa_440