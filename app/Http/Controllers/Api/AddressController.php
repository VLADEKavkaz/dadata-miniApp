<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Address;

class AddressController extends Controller
{
    public function search(Request $request)
    {
        $q = $request->query('q', '');
        if (trim($q) === '') {
            return response()->json(['suggestions' => []]);
        }

        $dadataToken = config('services.dadata.token') ?? env('DADATA_TOKEN');

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => "Token {$dadataToken}",
        ])->post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', [
            'query' => $q,
            'count' => 7,
        ]);

        if (! $response->successful()) {
            return response()->json(['error' => 'dadata error', 'body' => $response->body()], 500);
        }

        return $response->json(); 
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'value' => 'required|string',
            'meta' => 'nullable|array',
        ]);

        $address = $request->user()->addresses()->create([
            'value' => $data['value'],
            'meta' => $data['meta'] ?? null,
        ]);

        return response()->json($address);
    }

    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()->latest()->get();
        return response()->json($addresses);
    }
}
