# LinguaLeap - AI Vocabulary Builder

This is a Next.js application designed to help users expand their English vocabulary with AI-generated words, definitions, examples, and Arabic translations. It features a dynamic and interactive interface for a seamless learning experience.

---

## Prompt to Create a Beginner's Version of This App

If you wanted to create a similar application from scratch, here is a beginner-friendly prompt you could use:

**App Idea:** Create a simple web application called "LinguaLeap" using Next.js, React, and Tailwind CSS. The app's main purpose is to help users learn new English words with their Arabic translations.

**Key Features:**

1.  **Main Display:**
    *   The homepage should have a clean, centered layout.
    *   Display a "Word Card" that shows a single vocabulary word at a time.
    *   For each word, the card must display:
        *   The English word (e.g., "Eloquent").
        *   The Arabic translation (e.g., "فصيح").
        *   A simple definition in English.
        *   An example sentence in English.

2.  **User Interaction:**
    *   Include a "Next Word" button below the card. When clicked, it should show a new word.
    *   Add a dropdown menu (a `<select>` element is fine) that allows users to pick a category of words, such as "Emotional," "Professional," or "Intellectual."
    *   When a new category is selected, the app should fetch and display words related to that category.

3.  **AI-Powered Content:**
    *   Use a backend AI function (like one built with Genkit) to generate the vocabulary words.
    *   This AI function should accept a `category` (e.g., "Professional") and return a list of 5 words.
    *   Each word object returned by the AI must include the `english` word, its `arabic` translation, its `definition`, and an `example` sentence.

4.  **Styling and Layout:**
    *   Use basic Tailwind CSS for styling.
    *   Give the app a simple and pleasant color scheme. Define a primary color for titles and buttons.
    *   Ensure the layout is responsive and looks good on mobile devices.
    *   Add a simple header with the app's name, "LinguaLeap," and a short tagline like "Expand Your Vocabulary."
    *   Include a footer that says "Powered by Speed of Mastery."
