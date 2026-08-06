import { getProject, getStack, interpolate } from "@pulumi/pulumi";

export const GROUP_LABEL = {
  label: "com.docker.compose.project",
  value: interpolate`${getProject()}-${getStack()}`,
};
