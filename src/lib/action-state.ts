export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const defaultActionState: ActionState = {
  status: "idle",
};
