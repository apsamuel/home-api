# Home API

A simple API based on express that provides any **basic** data rendered on the `home` site

## TODOs

[ ] - allow fields to be nullable so they won't be shown when rendered

## Data Schemas

This data is static because it's not bound to change much

- resumeGeneralInfo

```javascript
    {
        infoName: '(String) your name',
        infoGenderPronouns: [
        '(String) pronouns',
        '...',
        ],
        infoSex: '(String) sex',
        infoBirthdate: '(String) birthday',
        infoTitle: '(String) professional title',
        infoLocation: '(String) city, state',
        infoCovid19Vaccination: '(Boolean) fully vaccinated or nah?',
        infoCovid19VaccinationBooster: '(Boolean) boosted or nah?',
    }
```

- resumeEducationHistory

```javascript
    [
        {
            schoolName: '(String) the school name',
            schoolType: '(String) the school type',
            schoolMajor: '(String) major focus of study',
            schoolStartYear: '(String) start year',
            schoolEndYear: '(String) end year',
            completionType: '(String) degree, diploma, award, or certificate received',
        },
    ]
```

- resumeSkillInfo

```javascript
    [
        {
            skillName: '(String) what skill do you have?',
            skillDescription:
                '(String) describe the skill',
            skillRating: '(Number) rate from 1-10 your skill level',
            skillExperienceYears: '(Number) provide how many years experience you have with this skill',
        },
    ]
```

## DynamoDB Schemas

This data is stored in DynamoDB to allow real CRUD, work history updates over time.

- resumeWorkHistory

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
