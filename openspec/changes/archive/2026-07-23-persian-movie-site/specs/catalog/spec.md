## ADDED Requirements

### Requirement: Category listing grid
The system SHALL render a Category page with a titled, responsive poster grid of media cards (8 columns at desktop) for the selected category.

#### Scenario: Grid rendered
- **WHEN** a Category page loads
- **THEN** it shows the category title and a responsive grid of media cards from the matching TMDB query

#### Scenario: Empty results
- **WHEN** a query returns no results
- **THEN** the grid shows an empty state rather than a blank area

### Requirement: Search bar
The system SHALL provide a search input that queries titles by name and updates the listing.

#### Scenario: Search executed
- **WHEN** the user submits a search term
- **THEN** the listing updates to matching TMDB results and the term is reflected in the URL

### Requirement: Filter bar and expandable panel
The system SHALL provide a filter bar (type film/series, genre, sort, and the "همه" scope) plus a "فیلترهای بیشتر" toggle that reveals a panel with country select, a year-range slider (1800–2026), and toggles for Persian dub, attached subtitles, and recommended.

#### Scenario: Panel expands
- **WHEN** the user activates "فیلترهای بیشتر"
- **THEN** the extended filter panel with country, year-range slider, and toggles is revealed

#### Scenario: Filters applied
- **WHEN** the user changes any filter and applies it
- **THEN** the listing re-queries TMDB with the selected genre, sort, country, year range, and toggle constraints

#### Scenario: Filters reflected in URL
- **WHEN** filters are applied
- **THEN** the active filters are encoded in the URL so the view is shareable and restorable

### Requirement: Pagination
The system SHALL render numbered pagination with the active page highlighted in the accent color, and navigation SHALL update the listing and URL.

#### Scenario: Page change
- **WHEN** the user selects a page number
- **THEN** the grid loads that page of results and the URL reflects the page

#### Scenario: Active page highlighted
- **WHEN** a page of results is shown
- **THEN** its page number is highlighted in the accent color
