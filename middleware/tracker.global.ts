export default defineNuxtRouteMiddleware((to, from) => {
  const tracker = useTracker();
  tracker.trackPageView(to.fullPath);
})
