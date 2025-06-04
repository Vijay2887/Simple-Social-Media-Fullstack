import createPostTable from "./tables/postTable.js";
import createUserTable from "./tables/userTable.js";
import createCommentTable from "./tables/commentTable.js";
import createFollowingTable from "./tables/followingTable.js";

const initTables = async () => {
  try {
    await createUserTable();
    await createPostTable();
    await createCommentTable();
    await createFollowingTable();
  } catch (err) {
    return err.message;
  }
};

export default initTables;
