"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

const layout = ({ children, params }) => {
  const session = useSession()
  const adminUser = session?.data?.user?.admin;
  //get project title
  const pathName = usePathname();
  const path = pathName.split("/");
  path.pop();
  const newUrl = path.join("/");

  return (
    <>
      {newUrl == `/projects/list/${params.slug}/tasks/update` ? (
        ""
      ) : (
        <div className="task-navigation-bar">
          <ul className="flex gap-9 border-b-zinc-600">
            <li>
              <Link
                className={
                  pathName == `/projects/list/${params.slug}/dashboard`
                    ? "text-blue-600"
                    : ""
                }
                href={`/projects/list/${params.slug}/dashboard`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathName == `/projects/list/${params.slug}/tasks`
                    ? "text-blue-600"
                    : "new navigation add"
                }
                href={`/projects/list/${params.slug}/tasks`}
              >
                Task
              </Link>
            </li>
            {adminUser == "true" ? (
              <li>
                <Link
                  className={
                    pathName == `/projects/list/${params.slug}/edit`
                      ? "text-blue-600"
                      : ""
                  }
                  href={`/projects/list/${params.slug}/edit`}
                >
                  Edit
                </Link>
              </li>) : ""}
          </ul>
        </div>
      )}

      <div>{children}</div>
    </>
  );
};

export default layout;
