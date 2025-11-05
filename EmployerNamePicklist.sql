SELECT Name, Id
FROM Account
WHERE RecordTypeId = '01261000000ksTuAAI'
  AND Division__c IN ('Retirees', 'Public', 'Care Provider', 'Private Facilities')
  AND Sub_Division__c = :placeholderValue
  AND Sub_Division__c != null
  AND Agency_Number__c != null
  AND Id NOT IN (
    '0014N00001iFKWWQA4',
    '0016100000Pw3XQAAZ',
    '0016100000TOfXsAAL',
    '0016100000Pw3aKAAR'
  )



SELECT Name, Id
FROM Account
WHERE RecordTypeId = '01261000000ksTuAAI'
  AND Division__c IN ('Retirees', 'Public', 'Care Provider', 'Private Facilities')
  AND Sub_Division__c = {$SUBDIVISION}
  AND Sub_Division__c != null
  AND Agency_Number__c != null
  AND Id NOT IN (
    '0014N00001iFKWWQA4',
    '0016100000Pw3XQAAZ',
    '0016100000TOfXsAAL',
    '0016100000Pw3aKAAR'
  )
ORDER BY Name