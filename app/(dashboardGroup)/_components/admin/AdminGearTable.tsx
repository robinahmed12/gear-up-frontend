// Read-only moderation table — all gear listings across every provider
"use client";

import { Gear } from "@/lib/types";


interface AdminGearTableProps {
  gears: Gear[];
}


export default function AdminGearTable({
  gears,
}: AdminGearTableProps) {


  return (
    <div className="overflow-x-auto rounded-lg border">


      <table className="w-full">


        <thead className="bg-muted">

          <tr>

            <th className="p-4 text-left">
              Gear
            </th>


            <th className="p-4 text-left">
              Category
            </th>


            <th className="p-4 text-left">
              Provider
            </th>


            <th className="p-4 text-left">
              Price/day
            </th>


            {/* <th className="p-4 text-left">
              Status
            </th> */}


          </tr>

        </thead>



        <tbody>


          {gears.length === 0 ? (

            <tr>
              <td
                colSpan={5}
                className="p-6 text-center"
              >
                No gear found
              </td>
            </tr>

          ) : (


            gears.map((gear) => (

              <tr
                key={gear.id}
                className="border-t"
              >

                <td className="p-4">

                  <div className="font-medium">
                    {gear.title}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {gear.brand}
                  </div>

                </td>



                <td className="p-4">
                  {gear.category?.name ?? "N/A"}
                </td>



                <td className="p-4">

                  {gear.provider.name ?? "Unknown"}

                </td>



                <td className="p-4">

                  ৳{gear.pricePerDay}

                </td>



                {/* <td className="p-4">

                  {gear. ?? "ACTIVE"}

                </td> */}


              </tr>

            ))

          )}


        </tbody>


      </table>


    </div>
  );
}