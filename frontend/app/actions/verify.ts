"use server";

export const verify = async (proof) => {
	console.log('proof', proof);
	const response = await fetch(
		'https://developer.worldcoin.org/api/v1/verify/app_b705f9962c72ec01782c091f7646b71a',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ...proof, action: "aa"}),
		}
	);
	if (response.ok) {
		const { verified } = await response.json();
		return { success: true, verified };
	} else {
		const { code, detail } = await response.json();
		return { success: false, error: `Error Code ${code}: ${detail}` };
	}
};
