import database from "@/service/database";

export async function POST(request: Request) {
  const bodyData = await request.json();
  const { orderId, products, totalPrice } = bodyData;

  try {
    if (!orderId || !products || !totalPrice) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    const q = `INSERT INTO sales_history ("orderId", "products", "totalPrice") 
                VALUES ($1, $2, $3)`;

    const result = await database.query(q, [
      orderId,
      JSON.stringify(products),
      totalPrice,
    ]);
    return Response.json({ message: "Insert Success" });
  } catch (error) {
    console.log("error", error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    // ดึงค่า Query Parameter จาก URL เผื่อกรณีต้องการค้นหาเฉพาะ orderId
    // เช่น api/products/history?orderId=1
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    let q = "";
    let values: any[] = [];

    if (orderId) {
      // ดึงข้อมูลเฉพาะ orderId ที่ระบุ
      q = `SELECT * FROM sales_history WHERE "orderId" = $1`;
      values = [orderId];
    } else {
      // ดึงข้อมูลทั้งหมด เรียงจากรายการล่าสุด (สมมติว่ามีคอลัมน์ id เป็น Auto Increment)
      q = `SELECT * FROM sales_history ORDER BY id DESC`;
    }

    const result = await database.query(q, values);

    return Response.json(result.rows);
  } catch (error) {
    console.log("error", error);
    // เพิ่ม HTTP Status 500 เพื่อบอกฝั่งหน้าบ้านว่าเกิด Error ที่ Server
    return Response.json({ message: "Fetch Fail" }, { status: 500 });
  }
}
