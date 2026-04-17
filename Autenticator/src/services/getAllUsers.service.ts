import { ofetch } from "ofetch";
import { useQuasar } from "quasar";



export interface User {
  id: number;
  username: string;
  email: string;
}

export async function getAllUsers() {
  const $q = useQuasar();
  try {
    const data = await ofetch(
      '/api/admin/users?filter={"fields":{"id":true,"username":true,"email":true}}',
    );

    const users = data.map((user: User) => ({
      id: user.id,
      label: `${user.username}(${user.email})`,
      value: user.id,
    }));

    return users

    // O si prefieres dos variables separadas:
    // const userLabels = data.map(user => `${user.username}(${user.email})`);
    // const userIds = data.map(user => user.id);
  } catch {
    $q.notify({ message: 'No se pudieron cargar los Usuarios', color: 'negative' });
  }

  return '[]'
}
