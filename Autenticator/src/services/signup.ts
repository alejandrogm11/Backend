import { ofetch } from "ofetch";

export async function SignUp(username: string, email: string, password: string) {

    const data = await ofetch('/api/signup', {
          method: 'POST',
          credentials: 'include',
          body: {
            username,
            email,
            password,
          },
        });

        return data;
  }
