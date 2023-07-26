import { NextFunction, Request, Response } from 'express';
import { ServiceLineRequest, ServiceLineResponse } from './dto';
import { addressLine, dbStarlink, serviceLine, terminals } from '@/db/schema/starlink';
import { DrizzleError, eq } from 'drizzle-orm';
import { nextTick } from 'process';
import { ApiError } from '@/api-error';

const handler = async (req: ServiceLineRequest, res: ServiceLineResponse, next: NextFunction) => {
  const { serviceLineNumber } = res.locals;
  try {
    // prettier-ignore
    const result = await dbStarlink
    .select({
      serviceLineNumber: serviceLine.serviceLineNumber,
      nickname: serviceLine.nickname,
      addressReferenceId: addressLine.addressReferenceId,
      locality: addressLine.locality,
      administrativeArea: addressLine.administrativeArea,
      administrativeAreaCode: addressLine.administrativeAreaCode,
      region: addressLine.region,
      regionCode: addressLine.regionCode,
      postalCode: addressLine.postalCode,
      metadata: addressLine.metadata,
      formattedAddress: addressLine.formattedAddress,
      latitude: addressLine.latitude,
      longitude: addressLine.longitude,
      userTerminalId : terminals.userTerminalId,
      kitSerialNumber: terminals.kitSerialNumber,
      dishSerialNumber: terminals.dishSerialNumber,
      terminalActive: terminals.active,
    })
    .from(serviceLine)
    .leftJoin(addressLine, eq(addressLine.addressReferenceId, serviceLine.addressReferenceId))
    .leftJoin(terminals, eq(terminals.serviceLineNumber, serviceLine.serviceLineNumber))
    .where(eq(serviceLine.serviceLineNumber, serviceLineNumber));

    if (result.length === 0) return next(new ApiError('Not Found', 404, { message: 'Service Line Not Found' }));

    res.status(200).json({
      success: true,
      message: 'Success',
      data: result[0],
    });
  } catch (err) {
    if (err instanceof DrizzleError) {
      return next(new ApiError('ORM Error', 500, { message: err.message }));
    }
    if (err instanceof Error) return next(new ApiError('Internal Server Error', 500, { message: err.message }));
  }
};

export default handler;
