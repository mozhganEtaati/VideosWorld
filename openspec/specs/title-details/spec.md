# Title Details Specification

## Purpose

Define the shared movie/series detail page — hero header, metadata, actions, the static download box, and recommended rows.

## Requirements

### Requirement: Detail hero header
The system SHALL render a detail hero with a blurred backdrop, the poster (2:3), the title with year, a rating cluster (IMDb and the additional percentage badges shown), a genre label, and a metadata row (runtime, screening date, release date, producing country).

#### Scenario: Details rendered
- **WHEN** a title's detail page loads
- **THEN** the hero shows poster, title, rating cluster, genre, and the metadata row

#### Scenario: Missing metadata
- **WHEN** a metadata value is unavailable from TMDB
- **THEN** the field renders its placeholder dash rather than being omitted, matching the reference

### Requirement: Jalali date display
The system SHALL display screening and release dates in the Jalali (Persian) calendar, converting TMDB Gregorian dates.

#### Scenario: Date converted
- **WHEN** a Gregorian release date is available
- **THEN** it is displayed as a Jalali date

### Requirement: Title actions
The system SHALL render the trailer action ("پخش تریلر"), the like and dislike counters ("دوست داشتم" / "دوست نداشتم"), and the dubbing-info action ("اطلاعات دوبله") as shown.

#### Scenario: Trailer available
- **WHEN** the title has a trailer video from TMDB
- **THEN** the trailer action opens the trailer

#### Scenario: Like/dislike counters
- **WHEN** the detail page renders
- **THEN** the like and dislike counts are shown from the mock-data boundary (display-only, no persistence)

### Requirement: Download box
The system SHALL render the download box ("باکس دانلود") with its informational notes, the dubbing banner, and per-quality rows (WEB-DL 1080p / 720p / 480p and Persian-dubbed audio) each with encoder label and the "دانلود مستقیم" and "پخش آنلاین" actions, plus "گزارش خرابی لینک" and "اشتراک گذاری".

#### Scenario: Download rows rendered
- **WHEN** the detail page loads
- **THEN** the download box shows one row per available quality with its actions, sourced from the mock-data boundary

### Requirement: Recommended rows
The system SHALL render "فیلم‌های پیشنهادی" and "سریال‌های پیشنهادی" rows using TMDB recommendations/similar for the current title.

#### Scenario: Recommendations shown
- **WHEN** the detail page loads
- **THEN** recommended movie and series rows render media cards from TMDB

### Requirement: Shared movie/series layout
The system SHALL use one detail layout for both movies and series, rendering season/episode information for series.

#### Scenario: Series detail
- **WHEN** a series detail page loads
- **THEN** the same layout renders with season/episode data from TMDB
