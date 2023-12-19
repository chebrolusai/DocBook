# REST API Endpoints

## For Patients

### User Account Management
- `POST /users` for account creation.
- `GET /users/{userId}` for retrieving account details.
- `PUT /users/{userId}` for updating account details.
- `DELETE /users/{userId}` for account deletion.

### Doctor Search and Information
- `GET /doctors` for searching doctors with query parameters for specialty, location, and insurance.
- `GET /doctors/{doctorId}` for retrieving detailed doctor profiles.

### Appointment Booking and Management
- `GET /doctors/{doctorId}/appointments` for viewing available appointment slots.
- `POST /appointments` for booking an appointment.
- `PUT /appointments/{appointmentId}` for updating (rescheduling) an appointment.
- `DELETE /appointments/{appointmentId}` for cancelling an appointment.

### Personal and Medical Information Management
- `GET /users/{userId}/medicalInfo` for retrieving medical information.
- `PUT /users/{userId}/medicalInfo` for updating medical information.

## For Doctors

### Doctor Profile Management
- `POST /doctors` for creating a doctor profile.
- `PUT /doctors/{doctorId}` for updating a doctor profile.

### Schedule Management
- `GET /doctors/{doctorId}/schedule` for retrieving a doctor's schedule.
- `PUT /doctors/{doctorId}/schedule` for updating a doctor's schedule.

### Appointment Management
- `GET /doctors/{doctorId}/appointments` for viewing a list of upcoming appointments.
- `PUT /appointments/{appointmentId}` for updating appointment details (e.g., marking as completed).

### Access to Patients' Medical Histories
- `GET /users/{userId}/medicalInfo` for accessing a patient's medical history.

## For Administrators

### User Account Administration
- `GET /admin/users` for listing all user accounts.
- `PUT /admin/users/{userId}` for updating user account status (e.g., disabling accounts).

### Insurance Provider Management
- `GET /insuranceProviders` for retrieving a list of providers.
- `POST /insuranceProviders` for adding a new provider.
- `PUT /insuranceProviders/{providerId}` for updating provider details.

### System Usage Reporting
- `GET /admin/reports/usage` for generating system usage reports.
