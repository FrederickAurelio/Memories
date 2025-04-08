import Button from "./Button";
import Avatar from "./Avatar";

type User = {
  firstName: string;
  lastName?: string;
  avatar: string;
};

function FriendRequest({ user }: { user: User }) {
  return (
    <div className="mx-1 my-2 flex items-center">
      <Avatar className="h-16 w-16" alt={user.firstName} src={user.avatar} />
      <div className="w-52 p-1 px-2">
        <h2 className="text-sm font-semibold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm">Send you a friend request</p>
        <div className="mt-1 flex h-6 gap-1">
          <Button size="small" variant="primary" className="rounded-lg text-sm">
            Accept
          </Button>
          <Button
            size="small"
            variant="secondary"
            className="rounded-lg text-sm"
          >
            Decline
          </Button>
        </div>
      </div>
      <span className="flex-grow py-1 text-end text-sm opacity-60">3d ago</span>
    </div>
  );
}

export default FriendRequest;
