SELECT 
    MIN(SubDivisionForOMA__c) SubDivisionForOMA,
    Sub_Division__c
FROM Account
WHERE RecordTypeId = '01261000000ksTuAAI'
  AND Division__c IN ('Retirees', 'Public', 'Care Provider', 'Private Facilities')
  AND Sub_Division__c != null
  AND SubDivisionForOMA__c != null
  AND Agency_Number__c != null
  AND Id NOT IN ('0014N00001iFKWWQA4','0016100000Pw3XQAAZ','0016100000TOfXsAAL','0016100000Pw3aKAAR')
GROUP BY Sub_Division__c
ORDER BY Sub_Division__c