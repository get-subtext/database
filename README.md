# SubText

> The SubText Database.

## Developer Quick start

```bash
# Install dependencies
pnpm install

# Create and configure .env file
cp .env.example .env

# Process an issue
pnpm run process-issue -i {ISSUE_NUMBER}

# Index the database
pnpm run index-db
```

## Developer Setup

### NPM Configuration

This repository uses [@get-subtext scoped packages](https://github.com/orgs/get-subtext/packages), which have been published to the GitHub Package Registry. In
order to have permission to install these packages, follow these steps to configure your npm environment:

1. Navigate to the [User Settings / Access Tokens page](https://github.com/settings/tokens).
2. Select **Generate new token (classic)**.
3. Fill out the form:
   - **Note**: `<YOUR_NAME> - npm install`
   - **Expiration**: No Expiration
   - **Scope**: `read:packages`
4. Copy the generated token and run the following commands, replacing `<YOUR_TOKEN>` with the token:

```bash
npm config set "@get-subtext:registry" https://npm.pkg.github.com/
npm config set "//npm.pkg.github.com/:_authToken" <YOUR_TOKEN>
```

> Note: This only needs to be done once, for all repositories in the get-subtext GitHub group.

## CI/CD Setup

The CI/CD pipeline for this repository uses a Personal Access Token with the correct scope, stored in an action secret called **NPM_TOKEN**, so that:

- The CI/CD's npm environment can be configured to grant access to install @get-subtext scoped dependencies from the GitHub Package Registry.

To create/rotate the token:

1. Navigate to the [User Settings / Access Tokens page](https://github.com/settings/tokens) and select 'Generate new token' | 'Generate new token (classic)'.
2. Add '@get-subtext/database - npm install' as note, 'No Expiration' as expiration, 'write:packages' as scope, and click the 'Generate token' button.
3. Copy the value of the new token into the **NPM_TOKEN** action secret in the [Actions secrets and variables page](https://github.com/get-subtext/database/settings/secrets/actions).

> Note: If other repositories are using the same **NPM_TOKEN** in CI/CD, be sure to change them too.

## References

- [npm-config](https://docs.npmjs.com/cli/v8/commands/npm-config)
