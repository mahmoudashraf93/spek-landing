---
layout: page
title: Privacy Policy
description: How Spek handles your information, including translation data, account details, and your privacy choices.
---
# Privacy Policy

Last updated: October 30, 2026

Spek is provided by Mahmoud Ashraf. Contact [africanlord.apps@gmail.com](mailto:africanlord.apps@gmail.com) with privacy questions.

## Account and translation services

Spek uses Sign in with Apple and Supabase for accounts. Your account may include the name and email address Apple shares with us. You can delete your account in the app’s Settings.

Translation requires an internet connection. When you request a translation, the text, audio, or image needed for that request is sent to Spek’s backend and OpenAI to process the translation. Selected language and country settings are sent with the request. These services have their own data processing and retention practices. Service diagnostics may also be processed to operate and troubleshoot the app.

Spek uses RevenueCat and Apple’s App Store to manage purchases and verify subscription access. RevenueCat receives subscription and purchase information and an app user identifier. Spek does not receive your payment card details.

## Optional usage analytics

In app versions that offer the Usage analytics choice, Firebase Analytics is enabled only if you allow it. You can decline or withdraw permission in Settings. This choice is separate from Apple’s advertising tracking permission.

Usage events describe screens, onboarding steps, translation attempts and outcomes, selected language and dialect codes, and purchase-screen interactions. Firebase also processes app-instance identifiers and technical app/device information for analytics. We do not put conversation text, transcriptions, audio, photos, names, email addresses, authentication tokens, or precise location in these events, and we do not set a Firebase user ID from your account.

Withdrawing permission stops further usage analytics collection and resets analytics data on the device. It does not automatically erase data already received by Google. See [Google’s privacy policy](https://policies.google.com/privacy) and [Firebase’s privacy information](https://firebase.google.com/support/privacy).

## Other SDKs and Apple analytics

Spek includes Meta and TikTok SDKs for advertising measurement. Their data practices and Apple’s tracking-permission controls are separate from the optional Firebase usage analytics described above. Review Apple’s privacy settings and Spek’s App Store privacy disclosures for information about these SDKs. Apple may also provide App Store and app analytics according to your Apple privacy settings.

## Your choices

- Allow or decline usage analytics, and change your choice in Spek’s Settings in supported versions.
- Manage microphone, camera, photo-library, and tracking permissions in iPhone Settings.
- Manage purchases and subscriptions through your Apple Account.
- Delete your Spek account from the app’s Settings, or contact support for help with data requests. Account deletion does not cancel an Apple subscription.

## This website

The website does not add advertising pixels, third-party fonts, or marketing analytics. The original usespek.com site is hosted on GitHub Pages until the hosting migration is completed. The Cloudflare review deployment and its free translator are hosted by Cloudflare. Hosting providers may process technical access information under their own privacy terms: [GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) and [Cloudflare](https://www.cloudflare.com/privacypolicy/).

## Free web translator

When you press Translate on a free web translator page, your submitted text and selected language codes pass through Spek's Cloudflare backend to Google Cloud Translation. Google returns the translated text. Spek does not save submitted text or translated results, put them in analytics, or log request bodies. This does not describe Google's or Cloudflare's own processing and retention; see [Google Cloud Translation data usage](https://cloud.google.com/translate/data-usage) and [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/).

The translator uses Cloudflare Turnstile to check automated traffic. Turnstile processes browser, device, and network signals and receives your IP address for the security check. See the [Turnstile privacy information](https://www.cloudflare.com/privacypolicy/) for its data practices.

A necessary first-party cookie, `spek_session`, contains a random session identifier and lasts up to seven days. It is used to apply the daily free allowance, not for advertising. The backend stores short-lived counts of requests and submitted characters, random request identifiers to prevent duplicate submissions, and a daily keyed hash derived from the connection's IP address. Spek's usage ledger does not store raw IP addresses. Session and IP counters are retained for up to three days; monthly aggregate character counts are retained for up to 33 days. These counters contain no submitted text or translated results. People sharing a connection may share an IP-based allowance. Clearing or blocking the session cookie can affect access to the translator.
