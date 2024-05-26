// In developpement mode, hostname is localhost 
// then, as we are not online, mockup_data are
// fetched instead of capytale data 
// See composables/*Fetch.ts files
const url = useRequestURL()
export const online = url.hostname != "localhost" 

// Set mockup_data user role 'teacher' ou 'student'
// export const user = "student"
export const user = "teacher"
