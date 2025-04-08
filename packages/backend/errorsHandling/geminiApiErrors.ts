export const customSleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

async function handleRateLimitError(
  attempt: number,
  maxRetries: number
): Promise<void> {
  console.log(
    `Attempt ${
      attempt + 1
    }/${maxRetries} failed with 429 (Too Many Requests). Retrying in 10 seconds...`
  );
  await customSleep(10000);
}

async function handleServiceUnavailableError(
  attempt: number,
  maxRetries: number
): Promise<void> {
  // Use fixed backoff times: 1s, 3s, 5s
  const backoffTimes = [1000, 3000, 5000];
  const backoffTime = backoffTimes[attempt] || 5000; // Default to 5s if attempt is out of bounds
  console.log(
    `Attempt ${
      attempt + 1
    }/${maxRetries} failed with 503. Retrying in ${backoffTime}ms...`
  );
  await customSleep(backoffTime);
}

export async function handleGenericError(
  attempt: number,
  maxRetries: number
): Promise<void> {
  const backoffTime = Math.pow(2, attempt) * 1000;
  console.log(
    `Attempt ${
      attempt + 1
    }/${maxRetries} failed. Retrying in ${backoffTime}ms...`
  );
  await customSleep(backoffTime);
}

export async function handleHttpError(
  response: Response,
  attempt: number,
  maxRetries: number
): Promise<boolean> {
  const errorText = await response.text();
  const error = new Error(
    `Gemini API error (${response.status}): ${errorText}`
  );

  switch (response.status) {
    case 429: // Too Many Requests
      await handleRateLimitError(attempt, maxRetries);
      return true; // Continue retrying

    case 503: // Service Unavailable
      await handleServiceUnavailableError(attempt, maxRetries);
      return true; // Continue retrying

    default:
      throw error; // For other errors, throw immediately
  }
}
