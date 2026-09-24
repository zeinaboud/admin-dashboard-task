import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateUserInput = {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  password: string;
};

type CreateUserResponse = {
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
};

async function createUser(input: CreateUserInput): Promise<CreateUserResponse> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create user");
  }

  return data;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}
