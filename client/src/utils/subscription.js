export const isPaidPlan = (planName) => {
  return planName === "Pro" || planName === "Premium";
};