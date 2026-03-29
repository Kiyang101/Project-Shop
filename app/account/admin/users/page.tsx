"use client";

import { useState, useEffect } from "react";
import useProduct from "@/service/product";
import useUser from "@/service/user";
import ImageById from "@/components/ImageById";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ImageByUser from "@/components/ImageByUser";
import ShowEditUser from "./ShowEditUser";
import useAuth from "@/service/auth";

const Logout = async () => {
  const _auth = useAuth();
  const res = await _auth.logout();
  if (res.logout) {
    window.location.href = "/login";
    return;
  }
  return;
};

export default function Page() {
  const _user = useUser();
  const [users, setUsers] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [search, setSearch] = useState<String>();

  const initUsers = async () => {
    const user = await _user.getUser();
    // console.log(user);
    const freshUsers = await _user.getAllUser(user);
    // console.log(freshUsers);
    setUsers(freshUsers);
  };

  useEffect(() => {
    initUsers();
  }, []);

  return (
    <>
      {editingUser && (
        <>
          <div className="fixed inset-0 z-20 bg-black/50"></div>
          <ShowEditUser
            user={editingUser}
            onClose={() => {
              setEditingUser(null);
              initUsers();
            }}
            onRefresh={initUsers}
          />
        </>
      )}

      <div className="min-h-screen bg-gray-50 p-8 text-gray-800 rounded-2xl">
        <div className="flex justify-between">
          <h1 className="text-2xl">
            <strong>Users</strong>
            <br />
            Manage Users Listing
          </h1>
          <div className="flex justify-around gap-5">
            <Button className="text-lg p-5 cursor-pointer" onClick={Logout}>
              LOGOUT
            </Button>
          </div>
        </div>
        <div className="w-9.5/10 mt-5 mx-2 text-black">
          <div className="relative">
            <input
              type="text"
              className=" block w-full p-3 ps-9 bg-neutral-secondary-medium border text-heading border-black
                    text-lg rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body rounded-3xl"
              placeholder="Search User Name or Email"
              onChange={() => {
                setSearch(String(event.target.value));
              }}
              suppressHydrationWarning={true}
            />
            <button className="absolute inset-e-1.5 bottom-1.5 text-xl border-transparent shadow-xs font-medium leading-5 rounded px-3 py-1.5 focus:outline-none hover:cursor-pointer">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-1" />
              {""}
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-5 ">
          <div className="w-full mx-auto bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <table className="w-full border-collapse">
              {/* ส่วนหัวตาราง (Table Header) */}
              <thead className="bg-white text-gray-400">
                <tr className="border-b h-16">
                  {/* กำหนดความสูงแถว */}
                  <th className="w-[25%] align-middle text-left pl-5 ">User</th>
                  <th className="w-[10%] align-middle text-center">Email</th>
                  <th className="w-[10%] align-middle text-center">Country</th>
                  <th className="w-[10%] align-middle text-center">Role</th>
                  {/* <th className="w-[10%] align-middle text-center">Status</th> */}
                  <th className="w-[10%] align-middle text-center">Action</th>
                </tr>
              </thead>

              {/* ส่วนเนื้อหา (Table Body) */}
              {users && (
                <tbody className="">
                  {users
                    .sort((a, b) =>
                      `${a.name} ${a.surName}`.localeCompare(
                        `${b.name} ${b.surName}`,
                      ),
                    )
                    .filter((user) => {
                      if (!search) {
                        return user;
                      } else if (
                        `${user.name} ${user.surName}`
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        user.email.toLowerCase().includes(search.toLowerCase())
                      ) {
                        return user;
                      }
                    })
                    .map((user, index) => {
                      return (
                        <tr
                          className="border-b border-gray-200"
                          key={user.userId}
                        >
                          <td className="py-6 px-5">
                            <div className="flex">
                              <div className="w-20 h-20">
                                <ImageByUser
                                  userId={user.userId}
                                  className={"rounded-sm"}
                                />
                              </div>
                              <h1 className="ml-3 text-xl">
                                {`${user.name} ${user.surName}`}
                              </h1>
                            </div>
                          </td>
                          <td className="py-6 px-4 align-top text-center text-xl leading-relaxed">
                            <p>{user.email}</p>
                          </td>
                          <td className="py-6 text-center align-top text-xl text-gray-500 ">
                            {user.country}
                          </td>
                          <td className="py-6 text-center align-top text-xl">
                            {user.role}
                          </td>

                          <td className="py-6 text-center align-top text-xl">
                            <Button
                              className="hover:cursor-pointer select-none"
                              onClick={() => setEditingUser(user)}
                            >
                              View / Edit
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
