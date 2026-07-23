# App Shell Specification

## Purpose

Provide the RTL Persian application shell — root layout, global providers, navbar, footer — and dark/light theming shared by every page.

## Requirements

### Requirement: RTL Persian root layout
The system SHALL render the application root with `dir="rtl"` and `lang="fa"`, using a Persian-friendly font (Vazirmatn), so all pages read right-to-left by default.

#### Scenario: Page rendered
- **WHEN** any page loads
- **THEN** the document direction is RTL, the language is Persian, and Latin titles remain visually LTR within the RTL flow

### Requirement: Global providers
The system SHALL wrap the application in a theme provider and a TanStack Query provider so theming and data fetching are available on every route.

#### Scenario: Providers available app-wide
- **WHEN** any route mounts
- **THEN** theme context and the query client are available to its components

### Requirement: Navbar
The system SHALL render a Navbar containing the centered logo, a search control, a theme switcher, a notifications icon, and a login/register call-to-action, matching the reference layout.

#### Scenario: Navbar controls present
- **WHEN** the Navbar renders
- **THEN** the logo, search, theme switcher, notifications icon, and auth CTA are all present and interactive

#### Scenario: Auth CTA navigation
- **WHEN** the user activates the login/register CTA
- **THEN** the app navigates to the auth screen

### Requirement: Footer
The system SHALL render a Footer with the copyright line and the three social call-to-action buttons (بله, تلگرام, اینستاگرام) styled per the reference.

#### Scenario: Footer rendered
- **WHEN** any page loads
- **THEN** the footer shows the copyright text and the three social buttons

### Requirement: Dark and light theming
The system SHALL support a default dark theme and a light theme, toggled from the navbar and persisted across reloads, with the light theme derived to match the palette shown on the details page.

#### Scenario: Theme toggled
- **WHEN** the user activates the theme switcher
- **THEN** the interface switches between dark and light and the choice persists across reloads

#### Scenario: Default theme
- **WHEN** a first-time visitor loads the site
- **THEN** the dark theme is applied by default
