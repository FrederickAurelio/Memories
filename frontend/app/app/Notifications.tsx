import FriendRequest from "../_components/FriendRequest";

function Notifications() {
  return (
    <>
      <h1 className="text-xl font-bold">Notifications</h1>
      <div className="flex h-52 flex-col overflow-y-scroll">
        {/* <div className="flex h-5/6 flex-col items-center justify-center opacity-60">
                <p>You&apos;re all caught up!</p>
                <p>No new notifications yet.</p>
              </div> */}
        <FriendRequest
          user={{
            firstName: "Frederick",
            lastName: "Aurelio Halim",
            avatar: "/Frederick.jpeg",
          }}
        />
      </div>
    </>
  );
}

export default Notifications;
