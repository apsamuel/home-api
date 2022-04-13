# Home API

A simple API based on express that provides any **basic** data rendered on the `home` site

## Schemas

- workHistory (persisted to DynamoDB)

```js
    {
      companyId: '(String) Unique Alpha numeric 25 character string'
      companyName: '(String) company name, primary key',
      companyAvatar:
        '(String) URL to company avatar, logo, etc.',
      companyCity: '(String) company city',
      compancyZip: '(Number) zip code',
      companyState: '(String) state',
      companyAddress: '(String) address',
      companyType: '(String) company type',
      companyRoles: [
        {
          roleStartDay: '(Number) start day',
          roleStartMonth: '(Number) start month',
          roleStartYear: '(Number) (Number) start year',
          roleEndDay: '(Number) end day',
          roleEndMonth: '(Number) end month',
          roleEndYear: '(Number) end day year',
          roleName: '(String) role name',
          roleGroup: '(String) role group',
          roleManager: '(String) role manager',
          roleDescription: [
              '(String) line item',
              '(String) ...'
          ],
          roleResponsibilities: [
              '(String) line item',
              '(String) ...'
          ],
          roleMilestones: [
            {
              milestoneName: '(String) milestone name',
              milestoneDescription: [
              '(String) line item',
              '(String) ...'
              ],
              milestoneBenefits: [
                '(String) line item',
                '(String) ...'
              ],
            },
          ],
          roleTech: [
            {
              roleTechName: '(String) tech name',
              roleTechType: '(String) tech type',
              roleTechProvider: '(String) tech provider/vendor',
            },
          ],
        },
      ],
    },
```

educationHistory (retuns data from `educationHistory()` function, save money)

```javascript
    [
        {
            schoolName: '(String) the school name',
            schoolType: '(String) the school type',
            schoolMajor: '(String) major focus of study',
            schoolStartYear: '(String) start year',
            schoolEndYear: '(String) end year',
            completionType: 'High School Diploma',
        },
    ]


```
