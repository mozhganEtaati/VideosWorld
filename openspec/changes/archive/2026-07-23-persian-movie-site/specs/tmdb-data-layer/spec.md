## ADDED Requirements

### Requirement: Environment-based TMDB credentials
The system SHALL read TMDB credentials and image base URL from environment variables and MUST NOT hardcode any API key or token in source.

#### Scenario: Credentials loaded from env
- **WHEN** the TMDB client is initialized
- **THEN** it reads the API token and image base URL from environment variables

#### Scenario: Missing credentials fail fast
- **WHEN** the required TMDB environment variable is absent at request time
- **THEN** the data layer throws a clear configuration error rather than issuing an unauthenticated request

### Requirement: Reusable typed TMDB client
The system SHALL expose a single reusable, typed API layer that all data fetching goes through, with endpoint functions returning strictly-typed results and no use of `any`.

#### Scenario: Fetch through the shared client
- **WHEN** any feature needs TMDB data
- **THEN** it calls a typed endpoint function from the shared service layer instead of calling `fetch` directly

#### Scenario: Persian localization requested
- **WHEN** an endpoint fetches titles or descriptions
- **THEN** it requests the `fa` language where TMDB supports it and falls back to the original language when a Persian value is absent

### Requirement: Query caching, loading, and error handling
The system SHALL fetch TMDB data via TanStack Query hooks that provide caching, loading states, and error states to consumers.

#### Scenario: Cached data reused
- **WHEN** the same query key is requested again within its stale window
- **THEN** cached data is served without a new network request

#### Scenario: Loading and error states exposed
- **WHEN** a query is pending or fails
- **THEN** the hook exposes a loading indicator and an error object so the UI can render skeleton and error states

### Requirement: Mock-data boundary for non-TMDB fields
The system SHALL supply data that TMDB cannot provide (download links and qualities, dubbing metadata, like/dislike counts, social links, captcha) through an isolated mock-data module, keeping it separate from the TMDB client so it can be replaced by a real backend later.

#### Scenario: Non-TMDB field requested
- **WHEN** the UI needs a download list, dubbing info, or like/dislike count
- **THEN** it reads from the mock-data boundary rather than the TMDB client

#### Scenario: Backend swap isolation
- **WHEN** a real backend replaces the mock data
- **THEN** only the mock-data module changes and TMDB-backed code remains untouched
