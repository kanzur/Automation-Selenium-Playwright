Feature: Tabs

@Tabs
    Scenario: Open and switch between tabs
        Given user is on the OrangeHRM login page
        When  user enters valid credentials
        And   user clicks Admin tab
        Then  tab title must be as Admin/User Management
        And   user clicks PIM tab
        Then  tab title must be as PIM
        And   user clicks Leave tab
        Then  tab title must be as Leave
        And   user clicks Time tab
        Then  tab title must be as Time/Timesheets
        And   user clicks Recruitment tab
        Then  tab title must be as Recruitment
        And   user clicks My Info tab
        Then  tab title must be as PIM
        And   user clicks Performance tab
        Then  tab title must be as Performance/Manage Reviews
        And   user clicks Dashboard tab
        Then  tab title must be as Dashboard
        And   user clicks Directory tab
        Then  tab title must be as Directory
        And   user clicks Claim tab
        Then  tab title must be as Claim
        And   user clicks Buzz tab
        Then  tab title must be as Buzz


