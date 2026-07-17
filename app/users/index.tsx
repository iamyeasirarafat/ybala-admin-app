import { Screen } from '@/components/Screen';
import { UserList } from '@/components/users';

export default function UsersScreen() {
  return (
    <Screen scroll>
      <UserList />
    </Screen>
  );
}
