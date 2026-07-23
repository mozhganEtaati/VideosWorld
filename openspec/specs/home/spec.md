# Home Specification

## Purpose

Define the Home page — a featured hero carousel followed by horizontally-scrolling category rows sourced from TMDB.

## Requirements

### Requirement: Hero carousel
The system SHALL render a hero carousel at the top of the Home page showing a featured title with its backdrop, title, rating/year badges, and a strip of selectable thumbnails.

#### Scenario: Featured title displayed
- **WHEN** the Home page loads
- **THEN** the hero shows a featured title with backdrop, title, and rating/year badges

#### Scenario: Thumbnail selection
- **WHEN** the user selects a thumbnail in the hero strip
- **THEN** the hero updates to the selected title

### Requirement: Category carousel rows
The system SHALL render the set of horizontally-scrolling category rows shown in the reference (latest movies, latest series, top 2026 movies, world series, Korean, Turkish, Chinese series, anime, Persian-dubbed movies, coming soon), each fed by its corresponding TMDB query.

#### Scenario: Rows populated
- **WHEN** the Home page loads
- **THEN** each category row renders media cards from its TMDB endpoint with the correct heading

#### Scenario: Horizontal scroll
- **WHEN** the user scrolls a row or uses its arrow controls
- **THEN** the row scrolls horizontally without moving the page

#### Scenario: Loading state
- **WHEN** a row's data is still loading
- **THEN** the row shows skeleton cards matching the card dimensions

### Requirement: View-all navigation
Each category row SHALL provide a "مشاهده همه" control that navigates to the corresponding Category page.

#### Scenario: View all
- **WHEN** the user activates "مشاهده همه" on a row
- **THEN** the app navigates to that category's listing page
