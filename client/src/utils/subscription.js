export const isPaidPlan = (planName) => {
  return planName === "Pro" || planName === "Premium";
};

export const isPremiumPlan = (planName) => {
  return planName === "Premium";
};