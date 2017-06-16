# Introduction

[![Build Status](https://travis-ci.org/Kashoo/kashoo-document-definitions.svg?branch=master)](https://travis-ci.org/Kashoo/kashoo-document-definitions) [![Greenkeeper Enabled](https://badges.greenkeeper.io/Kashoo/kashoo-document-definitions.svg)](https://greenkeeper.io/)

This repository defines the data model for Kashoo's Sync Gateway databases (aka buckets). The configuration is in the form of [synctos](https://github.com/Kashoo/synctos) document definitions. Each subdirectory of the `databases` directory defines the document types for a single database.

**DISCLAIMER**: These document definitions are intended only for use by Kashoo first party client applications. They are published publicly for illustrative purposes only. Expect that the data model may change without notice and, as such, it should not be relied upon for third party client application development.

# Usage

1. Install [Node.js](https://nodejs.org/) to build and run the project
2. Install the project's local dependencies (run from this directory): `npm install`
3. Generate sync functions with synctos (run from this directory): `etc/make-sync-functions.sh`
4. Execute the test suite (run from this directory): `npm test`

# Databases

The following Sync Gateway databases are defined within this repo:

#### app-config-sync

A database for storing _non-sensitive_ application configuration. For example, it is used to store the list of feature release toggles that are currently enabled for all apps/services in the environment.

#### business-sync

A database for documents that are tied to a specific business (e.g. customer payment processor configuration).

Document IDs should follow a hierarchical pattern with periods (.) as ID token separators. It is appropriate to use a UUID as an ID token wherever it is expected to be random and unique. For example, to represent a payment with ID "792b3e16-ae78-4a6b-9c8e-0ea0f9dfb0e8" for invoice "987" in business "123":

```
biz.123.invoice.987.payment.792b3e16-ae78-4a6b-9c8e-0ea0f9dfb0e8
```

This makes it easy to fetch a document if you know the individual ID tokens and the hierarchy.

#### square-data

A database for holding a copy of Square data that has been imported as part of a Merchant <-> Business integration. It currently stores five types of Square data: items, fees, payments, refunds and settlements. Documents are only stored for records that have been retrieved and imported to a Kashoo business.
