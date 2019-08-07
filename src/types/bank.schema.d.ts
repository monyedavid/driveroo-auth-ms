declare namespace BANK {
    interface bvn {
        account_number: string;
        bank_code: string;
        bvn: string;
        firstname: string;
        middle_name: string;
        last_name: string;
    }

    type methodman = "get" | "post";
}

declare namespace PAYSTACK {
    interface _bankData {
        name: string;
        slug: string;
        code: string;
        longcode: string;
        gateway: string;
        active: string;
        is_deleted: string;
        id: number;
        createdAt: string;
        updatedAt: string;
    }

    type _bvnResolved_data = {
        first_name: string;
        last_name: string;
        dob: string;
        mobile: string;
        bvn: string;
    };

    interface _bvnResolved {
        status: boolean;
        message: string;
        data: _bvnResolved_data;
        meta: any;
    }
}
