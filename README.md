# 🩺 Ehjzni App

A **Nuxt 3** medical reservation web application that facilitates the appointment booking process for patients. Users can browse available doctors, select appointment types, view time slots, and book appointments.

🔗 **[View Demo on CodeSandbox](https://codesandbox.io/p/github/Amr097/ehjzny/main)** ✨

---

## 🧭 Application Flow

The application walks users through a 4-step reservation process:

1. **Resource Selection**

   - On page load, a list of doctors is fetched and displayed for selection.

2. **Appointment Type**

   - Once a doctor is selected, available appointment types for that doctor are fetched.

3. **Time Slot Selection**

   - Based on the selected appointment type, available time slots for the doctor are displayed.

4. **Appointment Booking**
   - After selecting a time slot, the user fills out the booking form and submits the reservation. A success or error message is shown based on the result.

---

## 📌 Visual Flow

![App Flow Chart](/public/userflow.png)

---

## 🛠 Tech Stack

- **Nuxt 3**.
- **Tailwind CSS** .
- **VeeValidate + Yup** .
- **Vue Toastification**.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
