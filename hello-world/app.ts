import { APIGatewayProxyResult } from 'aws-lambda';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';

export const lambdaHandler = async (): Promise<APIGatewayProxyResult> => {
    process.stdout.write('Executing lambda function... \n');
    const AppDataSourceOptions: DataSourceOptions & SeederOptions = {
        type: 'postgres',
        host: 'host.docker.internal',
        port: 5432,
        username: 'pguser',
        password: 'password',
        database: 'test_db',
    };

    const AppDataSource = new DataSource(AppDataSourceOptions);

    if (!AppDataSource.isInitialized) {
        process.stdout.write('Initializing database... \n');
        await AppDataSource.initialize();
    }

    process.stdout.write('Running seeders... \n');

    await runSeeders(AppDataSource);

    return { statusCode: 200, body: 'Seeding completed successfully.' };
};
