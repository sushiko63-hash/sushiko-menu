export async function POST(req: Request) {
  const data = await req.json()

  console.log("PEDIDO:", data)

  return Response.json({
    ok: true
  })
}