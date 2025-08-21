# Web Application

This is a Next.js application that serves as a web interface for the Secure Knaight platform. It allows users to interact with role agents, manage roles and trust thresholds, and view signal analytics.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js
* npm

### Installing

1.  **Install the dependencies:**

    ```bash
    npm install
    ```

2.  **Set up the database:**

    This project uses Prisma for database management. The `setup-database.sh` script will initialize the database and apply the schema.

    ```bash
    ./setup-database.sh
    ```

3.  **Set up environment variables:**

    This project uses a `.env.local` file for environment variables. Copy the example file and fill in the required values:

    ```bash
    cp .env.example .env.local
    ```

    See the "Environment Variables" section below for more information on the required variables.

### Database Seeding

The project includes several scripts to seed the database with initial data. These scripts are located in the root of the `apps/web` directory.

*   `seed-data.ts`: Seeds the database with initial data for organizations, role agents, signals, and certifications.
*   `seed-comprehensive-roles.ts`: Seeds the database with a comprehensive set of role templates.
*   `seed-trust-thresholds.ts`: Seeds the database with trust thresholds for the roles created by `seed-comprehensive-roles.ts`.
*   `seed-comprehensive-trust-thresholds.ts`: Seeds the database with a more comprehensive set of trust thresholds.

To run a seed script, use the following command:

```bash
npx ts-node --compiler-options '''{"module":"commonjs"}''' <script-name>.ts
```

For example, to run the `seed-data.ts` script:

```bash
npx ts-node --compiler-options '''{"module":"commonjs"}''' seed-data.ts
```

### Running the Application

To run the application in development mode, use:

```bash
npm run dev
```

## Available Scripts

*   `npm run dev`: Runs the application in development mode.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts a production server.
*   `npm run lint`: Lints the code.
*   `npm run type-check`: Runs the TypeScript compiler to check for type errors.
*   `npm run postinstall`: Runs after `npm install` and generates the Prisma client.
*   `npm run prisma:generate`: Generates the Prisma client.
*   `npm run db:generate`: Generates the Prisma client.

## Environment Variables

The `.env.example` file contains a list of all the environment variables used by the application. Below is a description of each variable.

### Core Configuration

*   `NEXT_PUBLIC_BASE_URL`: The base URL for the application.
*   `NEXT_PUBLIC_ENVIRONMENT`: The environment type (e.g., `production`, `development`).
*   `NEXT_PUBLIC_API_VERSION`: The API version.

### Web3 & Blockchain Configuration

*   `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: The project ID for WalletConnect.
*   `NEXT_PUBLIC_ETHEREUM_MAINNET_RPC`: The RPC URL for the Ethereum mainnet.
*   `NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC`: The RPC URL for the Sepolia testnet.
*   `NEXT_PUBLIC_POLYGON_MAINNET_RPC`: The RPC URL for the Polygon mainnet.
*   `NEXT_PUBLIC_POLYGON_MUMBAI_RPC`: The RPC URL for the Mumbai testnet.
*   `NEXT_PUBLIC_FLARE_MAINNET_RPC`: The RPC URL for the Flare mainnet.
*   `NEXT_PUBLIC_FLARE_COSTON_RPC`: The RPC URL for the Coston testnet.
*   `NEXT_PUBLIC_SCK_NFT_ADDRESS`: The address of the SCK NFT credential contract.
*   `NEXT_PUBLIC_DID_REGISTRY_CONTRACT_ADDRESS`: The address of the DID registry contract.
*   `NEXT_PUBLIC_DAO_CONTRACT_ADDRESS`: The address of the DAO contract.
*   `NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS`: The address of the payment contract.

### Authentication & Identity

*   `NEXT_PUBLIC_DID_RESOLVER_URL`: The URL of the DID resolver.
*   `NEXT_PUBLIC_DID_METHOD`: The DID method to use.

### Payment & Monetization

*   `NEXT_PUBLIC_PAYMENT_STRATEGY`: The payment strategy to use.
*   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: The publishable key for Stripe.
*   `NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED`: Whether or not crypto payments are enabled.
*   `NEXT_PUBLIC_ILP_ENABLED`: Whether or not Interledger Protocol is enabled.

### Monitoring & Analytics

*   `NEXT_PUBLIC_SENTRY_DSN`: The DSN for Sentry.
*   `NEXT_PUBLIC_SENTRY_ENVIRONMENT`: The Sentry environment.
*   `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`: The ID for Vercel Analytics.
*   `NEXT_PUBLIC_ANALYTICS_ID`: The ID for custom analytics.
*   `NEXT_PUBLIC_APM_URL`: The URL for Application Performance Monitoring.
*   `NEXT_PUBLIC_UNLEASH_URL`: The URL for Unleash feature flags.
*   `NEXT_PUBLIC_UNLEASH_CLIENT_KEY`: The client key for Unleash.

### Internationalization

*   `NEXT_PUBLIC_DEFAULT_LOCALE`: The default locale.
*   `NEXT_PUBLIC_SUPPORTED_LOCALES`: A comma-separated list of supported locales.
*   `NEXT_PUBLIC_FALLBACK_LOCALE`: The fallback locale.

### API Configuration

*   `NEXT_PUBLIC_API_BASE_URL`: The base URL for the API.

### Caching Configuration

*   `NEXT_PUBLIC_REACT_QUERY_STALE_TIME`: The stale time for React Query.
*   `NEXT_PUBLIC_REACT_QUERY_CACHE_TIME`: The cache time for React Query.
*   `NEXT_PUBLIC_CDN_URL`: The URL for the Content Delivery Network.

### Logging & Debugging

*   `NEXT_PUBLIC_DEBUG_MODE`: Whether or not debug mode is enabled.
*   `NEXT_PUBLIC_LOG_LEVEL`: The log level.

### Compliance & Legal

*   `NEXT_PUBLIC_COOKIE_CONSENT_ENABLED`: Whether or not cookie consent is enabled.
*   `NEXT_PUBLIC_COOKIE_CONSENT_BANNER_TEXT`: The text for the cookie consent banner.
*   `NEXT_PUBLIC_PRIVACY_POLICY_URL`: The URL for the privacy policy.
*   `NEXT_PUBLIC_TERMS_OF_SERVICE_URL`: The URL for the terms of service.
*   `NEXT_PUBLIC_GDPR_ENABLED`: Whether or not GDPR is enabled.

### EU Compliance

*   `NEXT_PUBLIC_EU_COMPLIANCE`: Whether or not EU compliance is enabled.

### Subdomain Configuration

*   `NEXT_PUBLIC_SUBDOMAIN`: The subdomain for the deployment.

### Validation & Sanity Checks

*   `NEXT_PUBLIC_VALIDATE_ENVIRONMENT`: Whether or not to validate the environment.// Token updated - testing deployment
