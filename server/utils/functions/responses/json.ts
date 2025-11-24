const OK_STATUS_CODE = 200;

export function json(data: Record<PropertyKey, unknown>, status: number): Response {
	const isSuccess = status === OK_STATUS_CODE;

	return Response.json(
		{
			data,
			success: isSuccess,
		},
		{
			status,
		},
	);
}
