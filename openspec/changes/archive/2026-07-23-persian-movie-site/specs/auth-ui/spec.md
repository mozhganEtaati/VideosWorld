## ADDED Requirements

### Requirement: Auth tabbed card
The system SHALL render authentication as a centered card with a two-option pill tab switch ("ورود" / "عضویت"), where the active tab is highlighted in the accent color.

#### Scenario: Tab switch
- **WHEN** the user selects the other tab
- **THEN** the card switches between the login and register forms with the active tab highlighted

#### Scenario: Return to home
- **WHEN** the user activates "بازگشت به صفحه اصلی"
- **THEN** the app navigates to the Home page

### Requirement: Login form
The system SHALL render a login form with username, password, and a captcha field (with captcha image) plus the "ورود به حساب" submit button and a "رمز عبورم را فراموش کرده‌ام" link, exactly as shown. Authentication logic is out of scope.

#### Scenario: Login form rendered
- **WHEN** the login tab is active
- **THEN** the username, password, and captcha fields, submit button, and forgot-password link are shown

#### Scenario: No auth logic
- **WHEN** the user submits the login form
- **THEN** the UI performs no backend authentication (form is presentational only)

### Requirement: Register form
The system SHALL render a register form with username, mobile phone, email, password, repeat-password, and captcha fields plus the "ثبت‌نام و ورود" submit button, exactly as shown. Authentication logic is out of scope.

#### Scenario: Register form rendered
- **WHEN** the register tab is active
- **THEN** the username, phone, email, password, repeat-password, and captcha fields and the submit button are shown

#### Scenario: No auth logic
- **WHEN** the user submits the register form
- **THEN** the UI performs no backend registration (form is presentational only)
